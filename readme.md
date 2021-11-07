# Node.js is awesome

Sometimes not so awesome.


## Usage

```shell
npm start -- --key <OMDb API Key>
```


## API

| Method |    Endpoint   |         Description         |
|--------|---------------|-----------------------------|
| GET    | `/`           | [link](#Homepage)           |
| GET    | `/movies`     | [link](#Get all movies)     |
| GET    | `/movies/:id` | [link](#Get movie by ID)    |
| PATCH  | `/movies/:id` | [link](#Update movie by ID) |
| DELETE | `/movies/:id` | [link](#Delete movie by ID) |
| POST   | `/movies`     | [link](#Add new movie)      |

###### Homepage

Just load a static HTML homepage.

###### Get all movies

Return list of all user's movies from the service's storage. It supports sorting by different fields as well as pagination.

###### Get movie by ID

Return all information about movies associated with ID from the service's storage.

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
    "name": "",
    "comment": "",
    "personalScore": 2.5
}
```
