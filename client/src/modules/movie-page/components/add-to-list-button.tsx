import React, { useState, useEffect, useRef } from 'react';
import { Button, Menu, Typography, TextField, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector, shallowEqual, connect } from 'react-redux';
import Slider from '@material-ui/lab/Slider';
import { fetchUserDataCustom } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { ListEntryThin } from 'types/listing.services';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { addMovieToList } from '@src/store/actions/lists.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { MoviesSelectors } from '@src/store/reducers/movies.reducer';

type Props = {
  isRated: boolean;
};

const AddToListMenuBase = ({ isRated }: Props) => {
  const dispatch = useDispatch();

  const commentaryRef = useRef<HTMLInputElement>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rateValue, setRateValue] = useState(0);
  const [listId, setListId] = useState<string | null>(null);
  const classes = useStyles();

  const lists = useSelector(UserDataSelectors.userCurrentMovieLists);
  const { username } = useSelector(AuthSelectors.auth, shallowEqual);
  const { _id } = useSelector(MoviesSelectors.movie, shallowEqual);

  useEffect(() => {
    dispatch(fetchUserDataCustom({ username, ld: true }));
  }, []);

  const handleCreateRateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleRateClose = () => {
    setAnchorEl(null);
  };

  const handleAdditionAndRate = () => {
    if (!listId) dispatch(NotifyActions.error('You have to choose the list'));
    else {
      dispatch(
        addMovieToList({
          listId,
          commentary: !isRated ? commentaryRef.current!.value : undefined,
          rate: !isRated ? rateValue : undefined,
          movieId: _id as any,
        }),
      );
      handleRateClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateRateClick}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
      >
        Add to list
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleRateClose}>
        <div className={classes.rateCreateDialog}>
          <Typography variant="h6" component="span">
            Add to list
          </Typography>
          <FormControl>
            <InputLabel htmlFor="list">Choose list</InputLabel>
            <Select
              value={listId}
              onChange={e => setListId(e.target.value as string)}
              inputProps={{
                name: 'listId',
                id: 'list',
              }}
            >
              {invoke(lists, 'map', (lst: ListEntryThin, idx: number) => (
                <MenuItem key={`lst-${idx}`} value={lst._id}>
                  {lst.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!isRated ? (
            <>
              <TextField
                label="Commentary"
                multiline={true}
                inputRef={commentaryRef}
                className={classes.rateCreateField}
              />
              <div className={classes.rateSliderContainer}>
                <Typography variant="h4" style={{ textAlign: 'center' }} component="span">
                  {rateValue}
                </Typography>
                <Slider
                  min={0}
                  max={5}
                  value={rateValue}
                  step={1}
                  className={classes.rateSlider}
                  onChange={(_, value) => setRateValue(value)}
                />
              </div>
            </>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            className={classes.rateCreateButton}
            onClick={handleAdditionAndRate}
          >
            Add {!isRated && ' and rate'}
          </Button>
        </div>
      </Menu>
    </>
  );
};

export const AddToListMenu = connect()(AddToListMenuBase);

const useStyles = makeStyles({
  rateCreateDialog: {
    minHeight: 150,
    width: 220,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    '& span:nth-child(1)': {
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  },
  rateCreateField: {
    margin: '7px 0px',
  },
  rateCreateButton: {
    margin: '7px 0px',
  },
  rateSlider: {
    margin: '10px 10px 25px 10px',
    width: '90%',
  },
  rateSliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
