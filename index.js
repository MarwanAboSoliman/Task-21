import express from "express";
import { getCollectionName } from "./db.js";

const app = express();

app.get("/q1", async (req, res) => {
  const movies = await getCollectionName("movies");
  const pipeline = [
    {
      $match: {
        "imdb.rating": { $gt: 8.5 },
        "imdb.votes": { $gt: 10000 },
        "awards.wins": { $gte: 5 },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        year: 1,
        "imdb.rating": 1,
        "awards.wins": 1,
      },
    },
  ];

  const data = await movies.aggregate(pipeline).toArray();
  res.json(data);
});

app.get("/q2", async (req, res) => {
  const theaters = await getCollectionName("theaters");
  const pipeline = [
    {
      $match: {
        "location.address.state": "CA",
        "location.address.city": { $in: ["San Francisco", "Los Angeles"] },
      },
    },
    {
      $project: {
        _id: 0,
        theaterId: 1,
        "location.address.state": 1,
        "location.address.city": 1,
      },
    },
  ];

  const data = await theaters.aggregate(pipeline).toArray();
  res.json(data);
});
app.get("/q3", async (req, res) => {
  const movies = await getCollectionName("movies");
  const pipeline = [
    {
      $match: {
        title: "The Matrix",
        year: 1999,
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "movie_id",
        as: "movie_comments",
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        year: 1,
        movie_comments: 1,
      },
    },
  ];

  const data = await movies.aggregate(pipeline).toArray();
  res.json(data);
});

app.get("/q4", async (req, res) => {
  const movies = await getCollectionName("movies");
  const data = await movies
    .aggregate([
      {
        $match: {
          genres: "Sci-Fi",
          "imdb.rating": { $gt: 8.5 },
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { movieId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } },
            { $sort: { date: -1 } },
            { $limit: 3 },
            {
              $project: {
                _id: 0,
                name: 1,
                text: 1,
                date: 1,
              },
            },
          ],
          as: "movie_comments",
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          year: 1,
          "imdb.rating": 1,
          movie_comments: 1,
        },
      },
    ])
    .toArray();

  res.json(data);
});

app.listen(3000, () => {
  console.log("Connected On port 3000");
});
