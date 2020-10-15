# Havoc Tracker - Backend

## Introduction

Havoc Tracker is a project for helping survivors in a Zombie Apocalypse. The backend is made in Node.js with Express.js. The database is built in MongoDB, with the help of Mongoose lib. This is a RESTful API server.

## Install

```sh
npm install
```

## Running the API server

```sh
npm start
```

Now your Havoc Tracker - Backend server is running!

## Testing

```sh
npm test
```

## API Endpoints

### People

* Create a new survivor: `POST /api/people`

```js
body: {
  name,
  age,
  gender,
  lastLocationLat,
  lastLocationLng,
  water,
  food,
  firstAid,
  gun
}
```

* List all survivors: `GET /api/people`

* Get information about a survivor: `GET /api/people/:id`

* Update location of a survivor: `PATCH /api/people/:id`

```js
body: {
  lastLocationLat,
  lastLocationLng,
}
```

* Report a survivor as infected : `POST /api/people/:id/report-infection`

A survivor can report another survivor as infected by name input. When this last gets 5 flags, it is turned to infected. A survivor can only report the same survivor one time.
The infected items are given to the 5th person that reported. The value of these items are saved as infected points on the infected, for posterior data reports.
An infected cannot report.

```js
body: {
  infected
}
```

### Properties

* Trade items between survivors : `POST /api/people/:id/properties/trade-item`

The trade between two survivors is done by exact match of item values. The first survivor ID is identified by params, the second survivor ID is identified by body. The other body inputs are related to the quantity traded by each survivor.
An infected cannot trade.

```js
body: {
  id,
  user1water,
  user2water,
  user1food,
  user2food,
  user1firstAid,
  user2firstAid,
  user1gun,
  user2gun
}
```

* Get all inventory of a survivor : `GET /api/people/:id/properties`

### Reports

* Get the percentage of infected people : `GET /api/report/infected`

* Get the percentage of non-infected people : `GET /api/report/non-infected`

* Get the averages of all survivors items, excluding infected: `GET /api/report/people-inventory`

* Get the total infected points : `GET /api/report/infected-points`

* Get a list of all available reports : `GET /api/report`
