import React, { Suspense, useEffect } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Card, CardHeader, Typography, CardContent, CardMedia } from '@material-ui/core';
import invoke from 'lodash/invoke';

import { fetchListData } from '@src/store/actions/lists.actions';
import { ListsSelectors } from '@src/store/reducers/lists.reducer';

const ListPageBase = ({ match }: RouteComponentProps<{ listId: string }>) => {
  const { listId } = match.params;

  const dispatch = useDispatch();
  const listData = useSelector(ListsSelectors.list, shallowEqual);

  useEffect(() => {
    dispatch(fetchListData(listId));
  }, [listId]);

  const ListData = () => {
    if (!listData) return null;
    else
      return (
        <Grid container={true} spacing={8}>
          <Grid item={true} xs={7}>
            <Card>
              <CardHeader title={listData.title} subheader={listData.description} />
              <CardContent>
                <Typography>Is private list: {listData.private}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12}>
            {invoke(listData.movies, 'map', (item: typeof listData.movies[0]) => (
              <Card>
                <CardHeader title={item.title} />
                <CardMedia image={item.poster} title={item.title} />
                <CardContent>
                  <Typography>Rating: {item.rate}</Typography>{' '}
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      );
  };

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <ListData />
    </Suspense>
  );
};

export const ListPage = connect()(withRouter(ListPageBase));
