import {CustomRequestHandler} from 'types/utils';
import {ListingServices} from '@src/pkg/listing/listing.services';

export const getByUserId: CustomRequestHandler = async (req, res) => {
  const {userId} = req.params;
  const userLists = await ListingServices().getByUserId({
    userId,
    selfId: req.auth ? req.auth.userId : null,
  });
  return res.status(200).send(userLists);
};

export const getList: CustomRequestHandler = async (req, res) => {
  const {listId} = req.params;
  const list = await ListingServices().get({
    listId,
    selfId: req.auth ? req.auth.userId : null,
  });
  return res.status(200).send(list);
};

export const createList: CustomRequestHandler = async (req, res) => {
  const {title, description, isPrivate} = req.body;

  await ListingServices().create({
    title,
    description,
    isPrivate,
    selfId: req.auth.userId,
  });
  return res.status(200);
};

export const modifyList: CustomRequestHandler = async (req, res) => {
  const {title, description, isPrivate} = req.body;
  const {listId} = req.params;

  await ListingServices().modify({
    listId,
    title,
    description,
    isPrivate,
    selfId: req.auth.userId,
  });
  return res.status(200);
};

export const deleteList: CustomRequestHandler = async (req, res) => {
  const {listId} = req.params;

  await ListingServices().modify({
    listId,
    selfId: req.auth.userId,
  });
  return res.status(200);
};

export const addMovie: CustomRequestHandler = async (req, res) => {
  const {listId} = req.params;
  const {movieId, rate, commentary} = req.body;
  await ListingServices().addMovie({
    movieId,
    rate,
    commentary,
    listId,
    selfId: req.auth.userId,
  });
  return res.status(200);
};

export const removeMovie: CustomRequestHandler = async (req, res) => {
  const {listId} = req.params;
  const {movieId} = req.body;
  await ListingServices().removeMovie({
    movieId,
    listId,
    selfId: req.auth.userId,
  });
  return res.status(200);
};
