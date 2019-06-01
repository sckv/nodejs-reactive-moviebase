import React, { Suspense, useEffect, useState, useRef } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  Grid,
  Card,
  CardHeader,
  Typography,
  CardContent,
  Container,
  makeStyles,
  Button,
  TextField,
  Switch,
  CardActions,
} from '@material-ui/core';
import invoke from 'lodash/invoke';
import CheckIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { fetchListData, deleteList, modifyList } from '@src/store/actions/lists.actions';
import { ListsSelectors } from '@src/store/reducers/lists.reducer';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { ListEntry } from '@src/modules/list-page/components/list-entry';

const ListPageBase = ({ match }: RouteComponentProps<{ listId: string }>) => {
  const { listId } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const listData = useSelector(ListsSelectors.current, shallowEqual);
  const authData = useSelector(AuthSelectors.auth, shallowEqual);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const checkerRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    !listData && dispatch(fetchListData({ listId }));
    listData && listData!._id !== listId && dispatch(fetchListData({ listId }));
  }, [listId]);

  const saveEditing = () => {
    if (!titleRef.current) dispatch(NotifyActions.error("Title can't be empty"));
    else {
      dispatch(
        modifyList({
          listId,
          isPrivate: checkerRef.current!.checked,
          title: titleRef.current!.value,
          description: descriptionRef.current!.value,
          refetch: true,
        }),
      );
      setEditMode(false);
    }
  };

  const ListData = () => {
    if (!listData) return null;
    else
      return (
        <Container className="container">
          <Grid container={true} spacing={4} className={classes.grid}>
            <Typography className={classes.mainTitle} variant="h3">
              {listData.username}'s list
            </Typography>
            <Grid item={true} xs={12}>
              <Card>
                <CardHeader
                  title={
                    <div className={classes.cardTitleWButton}>
                      <span>
                        {editMode ? (
                          <TextField
                            inputRef={titleRef}
                            defaultValue={listData.title}
                            style={{ marginBottom: 5 }}
                            InputProps={{ style: { fontSize: 25 } }}
                          />
                        ) : (
                          listData.title
                        )}
                      </span>
                      {listData.username === authData.username ? (
                        <div>
                          <Button color="primary" style={{ marginRight: 10 }} onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Leave editing' : 'Edit list'}
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => {
                              if (!listData) return dispatch(NotifyActions.error('No list currently available'));
                              dispatch(deleteList(listData._id));
                            }}
                          >
                            Remove list
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  }
                  subheader={
                    <>
                      {editMode ? (
                        <TextField defaultValue={listData.description} inputRef={descriptionRef} />
                      ) : (
                        listData.description
                      )}
                    </>
                  }
                />
                <CardContent>
                  <Typography className={classes.privateLabel} component="div">
                    <span>Is private list:</span>{' '}
                    {editMode ? (
                      <Switch defaultChecked={listData.private} color="primary" inputRef={checkerRef} />
                    ) : listData.private ? (
                      <CheckIcon color="primary" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </Typography>
                </CardContent>
                {editMode ? (
                  <CardActions style={{ flexDirection: 'row-reverse' }}>
                    <Button variant="contained" color="primary" onClick={saveEditing}>
                      Save editing
                    </Button>
                  </CardActions>
                ) : null}
              </Card>
            </Grid>
            <Grid item={true} xs={12}>
              {invoke(listData.movies, 'map', (item: typeof listData.movies[0], idx: number) => (
                <ListEntry
                  key={`mov+${idx}`}
                  poster={item.poster}
                  title={item.title}
                  rate={item.rate}
                  _id={item._id}
                  editable={editMode}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      );
  };

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <ListData />
    </Suspense>
  );
};

export const ListPage = connect()(withRouter(ListPageBase));

const useStyles = makeStyles({
  grid: {
    padding: 0,
    width: '100%',
    margin: 0,
  },
  mainTitle: {
    marginTop: 10,
    marginLeft: '10%',
  },
  privateLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  cardTitleWButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& span': {
      marginLeft: 15,
    },
  },
});
