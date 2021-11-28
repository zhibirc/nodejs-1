# Private movie collections

## Usage

```shell
# development
npm run dev -- --key <OMDb API Key>

# Docker
OMDB_KEY=<OMDb API Key> docker compose up --build
```


## API

| Method |                     Endpoint                       |         Description               |
|--------|----------------------------------------------------|-----------------------------------|
| GET    | `/`                                                | [link](#Homepage)                 |
| GET    | `/movies?fields=Field_1,Field_2&limit=2&offset=10` | [link](#Get all movies)           |
| GET    | `/movies/:id`                                      | [link](#Get movie by ID)          |
| GET    | `/favorites`                                       | [link](#Get Favorites movie list) |
| PATCH  | `/movies/:id`                                      | [link](#Update movie by ID)       |
| DELETE | `/movies/:id`                                      | [link](#Delete movie by ID)       |
| POST   | `/movies`                                          | [link](#Add new movie)            |
| POST   | `/favorites`                                       | [link](#Set movie Favorites state)|
| POST   | `/register`                                        | [link](#Register)                 |
| POST   | `/login`                                           | [link](#Login)                    |

###### Homepage

Just load a static HTML homepage.

###### Get all movies

Return list of all user's movies from the service's storage. It supports sorting by different fields as well as pagination.

###### Get movie by ID

Return all information about movies associated with ID from the service's storage.

###### Get Favorites movie list

Return Favorites movie list for registered user. Each user has his own Favorites list of movies.
All filters available for getting all movies are also supported.

###### Update movie by ID

Update user's information about the particular movie.

**Body**:

```json
{
    "comment": "",
    "personalScore": 2.5
}
```

###### Delete movie by ID

Delete a movie from the service's storage.

###### Add new movie

Add a new movie to the service's storage. Search for a movie by name in the OMDb database and if the movie exists - add this information to the storage.
Otherwise - just store data provided in the request by the user. Also, the user can set his own movie's score,
and some text comment which should be saved among other data in the service's storage.

**Body**:

```json
{
    "id": "id-1",
    "favorites": true
}
```

###### Set movie Favorites state

Include/exclude a movie to/from Favorites list for particular user.

**Body**:

```json
{
    "id": "",
    "comment": "",
    "personalScore": 2.5
}
```

###### Register

Sign-up. Email and password are required.

###### Login

Sign-in. JWT-based authentication strategy.
