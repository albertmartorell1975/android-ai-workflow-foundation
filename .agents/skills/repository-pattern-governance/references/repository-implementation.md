# Repository Implementation Strategy

## Domain Layer Contract (`domain/.../repository/CharacterRepository.kt`)
The repository interface MUST be defined in the domain layer using domain models and typed domain errors.

```kotlin
package com.example.app.domain.repository

import com.example.app.domain.model.Character
import com.example.app.domain.model.DomainError
import com.example.app.domain.model.Result
import kotlinx.coroutines.flow.Flow

interface CharacterRepository {
    fun getCharacters(page: Int): Flow<Result<List<Character>, DomainError>>
    suspend fun getCharacterDetail(id: Int): Result<Character, DomainError>
    suspend fun toggleFavorite(characterId: Int): Result<Unit, DomainError>
    fun getFavoriteCharacters(): Flow<List<Character>>
}
```

## Data Layer Implementation (`data/.../repository/CharacterRepositoryImpl.kt`)
The concrete implementation of the repository belongs in the Data Module. It coordinates Single Source of Truth (SSOT), mapping, and safe execution.

```kotlin
package com.example.app.data.repository

import com.example.app.data.source.local.LocalDataSource
import com.example.app.data.source.remote.RemoteDataSource
import com.example.app.data.mapper.toDomain
import com.example.app.data.mapper.toEntity
import com.example.app.data.util.safeCall
import com.example.app.domain.repository.CharacterRepository
import com.example.app.domain.model.Character
import com.example.app.domain.model.DomainError
import com.example.app.domain.model.Result
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

class CharacterRepositoryImpl @Inject constructor(
    private val remoteDataSource: RemoteDataSource,
    private val localDataSource: LocalDataSource
) : CharacterRepository {

    override fun getCharacters(page: Int): Flow<Result<List<Character>, DomainError>> = flow {
        // 1. Fetch from Remote using safeCall with automatic exception mapping
        val remoteResult = safeCall { remoteDataSource.getCharacters(page) }
        
        when (remoteResult) {
            is Result.Success -> {
                val remoteCharacters = remoteResult.data
                
                // 2. Cross-reference with Local Data (e.g. keep 'isFavorite' state)
                val localFavorites = localDataSource.getFavoriteIds()
                val mappedEntities = remoteCharacters.map { 
                    it.toEntity(isFavorite = localFavorites.contains(it.id)) 
                }
                
                // 3. Cache Remote data into Local Database (SSOT)
                localDataSource.insertCharacters(mappedEntities)
                
                // 4. Map to Domain models and Emit Result.Success
                emit(Result.Success(mappedEntities.map { it.toDomain() }))
            }
            is Result.Error -> {
                // Fallback to local cached data if available, otherwise emit DomainError
                val localData = localDataSource.getCharacters()
                if (localData.isNotEmpty()) {
                    emit(Result.Success(localData.map { it.toDomain() }))
                } else {
                    emit(Result.Error(remoteResult.error))
                }
            }
        }
    }

    override suspend fun getCharacterDetail(id: Int): Result<Character, DomainError> {
        return safeCall { remoteDataSource.getCharacterDetail(id).toDomain() }
    }

    override suspend fun toggleFavorite(characterId: Int): Result<Unit, DomainError> {
        return safeCall { localDataSource.toggleFavorite(characterId) }
    }

    override fun getFavoriteCharacters(): Flow<List<Character>> {
        return localDataSource.getFavoriteCharactersFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }
}
```