import React from 'react';
import { Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import { MovieRequestThin } from 'types/movies-requesting.services';
import { prependOnceListener } from 'cluster';
import styled from '@emotion/styled';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 'auto',
      height: 200,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }),
);

type Props = MovieRequestThin & { forwardedRef?: any } & { style?: any };

export const MovieCard = ({
  _id,
  forwardedRef,
  averageRate,
  poster,
  plot,
  rate,
  score,
  title,
  ttid,
  year,
  style,
}: Props) => {
  const classes = useStyles();
  // const theme = useTheme<Theme>();

  return (
    <CardWrapper style={style} ref={forwardedRef}>
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {title} - {year}
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {plot}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Average votings rate: {averageRate}
            </Typography>
          </CardContent>
          {/* <div className={classes.controls}>
          <IconButton aria-label="Previous">
            prependOnceListener(event, listener){theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="Play/pause">
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="Next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </div> */}
        </div>
        <div style={{ flexGrow: 1 }} />
        <CardMedia className={classes.cover} image={poster} title={title} component="img" />
      </Card>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  margin: 25px 0px;
`;
