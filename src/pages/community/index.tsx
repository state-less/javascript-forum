import {
  Container,
  Button,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Link,
  Pagination,
  CardActions,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
} from '@mui/material';
import { useComponent, useLocalStorage } from '@state-less/react-client';
import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Markdown } from '../../components/Markdown';
import { FlexBox } from '../../components/FlexBox';
import { calc } from '../../server-components/examples/VotingApp';
import { PAGE_SIZE_POSTS, PAGE_START } from '../../lib/const';
import { ViewCounter } from '../../server-components/examples/ViewCounter';
import { FORUM_BASE_PATH, FORUM_KEY, FORUM_RULES_GH } from '../../lib/config';

export const CommunityPage = () => {
  const [page, setPage] = useState(PAGE_START);
  const [pageSize, setPageSize] = useLocalStorage(
    'forum-page-size',
    PAGE_SIZE_POSTS
  );
  const [component, { loading }] = useComponent(FORUM_KEY, {
    props: {
      page,
      pageSize,
      compound: false,
    },
  });
  useEffect(() => {
    document
      .getElementById('root-container')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Container maxWidth="lg" disableGutters>
      <Card
        sx={{
          boxShadow: '0 2px 2px -2px gray;',
          px: {
            xs: 0,
            sm: 2,
            md: 4,
          },
          mb: '1px',
        }}
      >
        {/* <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown> */}
        <Header pageSize={pageSize} setPageSize={setPageSize} />
        <CardContent>
          {document.getElementById('progress') &&
            createPortal(
              loading ? (
                <LinearProgress color="secondary" variant={'indeterminate'} />
              ) : (
                <LinearProgress
                  color="secondary"
                  value={100}
                  variant="determinate"
                />
              ),
              document.getElementById('progress')!
            )}
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={9}
              order={{
                xs: 1,
                md: 0,
              }}
            >
              <Posts component={component} />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              order={{
                xs: 0,
                md: 1,
              }}
            >
              <StickyCard top={64}>
                <CardContent>
                  <Markdown center={false} src={FORUM_RULES_GH}>
                    Error Loading Rules
                  </Markdown>
                </CardContent>
              </StickyCard>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions
          sx={{
            boxShadow: '0px 0px 2px 0px black',
            display: 'flex',
            mt: 4,
          }}
        >
          <Pagination
            count={Math.ceil(component?.props?.totalCount / pageSize) || 0}
            page={page}
            onChange={(_, p) => setPage(p)}
          />

          <PageSize pageSize={pageSize} setPageSize={setPageSize} />
        </CardActions>
      </Card>
    </Container>
  );
};

export const StickyCard = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref?.current) return;
    const onScroll = (e: any) => {
      const scrollTop = e?.target?.scrollTop || 0;

      const max =
        (ref?.current?.parentElement?.getBoundingClientRect?.()?.height || 0) -
        (ref?.current?.getBoundingClientRect()?.height || 0) -
        16;
      const top = Math.min(max, Math.max(0, scrollTop - props.top)) + 'px';
      if (ref.current) {
        ref.current.style.transform = `translateY(${top})`;
      }
    };
    document.getElementById('scroll')?.addEventListener('scroll', onScroll);
    return () => {
      document
        .getElementById('scroll')
        ?.removeEventListener('scroll', onScroll);
    };
  }, [ref?.current]);
  return <Card ref={ref}>{props.children}</Card>;
};

const Post = (post) => {
  const [votes] = useComponent(post.children[0]?.component, {
    data: post.children[0],
  });
  const { score, upvotes, downvotes } = votes?.props || {};
  const wilson = true,
    random = true;

  const randomUp = useMemo(() => Math.random(), []);
  const randomDown = useMemo(() => Math.random(), []);
  const sum = useMemo(
    () =>
      calc(upvotes, {
        lb: score?.upvote[0],
        ub: score?.upvote[1],
        wilson,
        random,
        r: randomUp,
      }) -
      calc(downvotes, {
        lb: score?.downvote[0],
        ub: score?.downvote[1],
        wilson,
        random,
        r: randomDown,
      }),
    [upvotes, downvotes, score, wilson, random]
  );

  const nAnswers = post.children.filter(
    (c) => c?.props?.body && !c?.props?.deleted
  )?.length;

  return (
    <Card
      square
      sx={{
        opacity: post.props.deleted ? 0.9 : 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
      >
        {post?.props?.sticky && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: {
                xs: '100%',
                md: '2px',
              },
              height: {
                xs: '2px',
                md: 'unset',
              },
              // borderTop: '4px dashed',
              backgroundColor: 'info.main',
            }}
          ></Box>
        )}

        <Grid container>
          <Grid item order={{ xs: 2, md: 0 }} xs={12} md={3}>
            <FlexBox sx={{ flexDirection: 'column', gap: 1, minWidth: 200 }}>
              <PostOverviewMeta
                plainText={false}
                nAnswers={nAnswers}
                nVotes={sum}
                post={post}
              />
            </FlexBox>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box>
              <CardHeader
                title={
                  <Link
                    sx={{ color: 'secondary.main' }}
                    to={`${FORUM_BASE_PATH}/${post.component}`}
                    component={RouterLink}
                  >
                    {post.props.title}
                  </Link>
                }
                sx={{ pb: 0 }}
              />
              <CardContent
                sx={{
                  pt: 0,
                  pb: '0rem !important',
                  maxHeight: '5rem',
                  mb: 2,

                  overflow: 'hidden',
                }}
              >
                <Markdown preview disablePadding center={false}>
                  {post.props.body}
                </Markdown>
              </CardContent>
              {post.props.tags?.length > 0 && (
                <CardContent sx={{ display: 'flex', gap: 1 }}>
                  {post.props.tags?.map((tag) => (
                    <Chip size="small" label={tag} />
                  ))}
                </CardContent>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

const PostOverviewMeta = ({ nVotes, nAnswers, post, plainText }) => {
  const votesStr = `${nVotes} votes`;
  const answersStr = `${nAnswers} answers`;
  return (
    <CardContent
      sx={{
        ml: 'auto',
        mr: {
          xs: 'auto',
          md: 'unset',
        },
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: {
          xs: 'row',
          md: 'column',
        },
        gap: 1,
        textAlign: 'right',
      }}
    >
      {plainText ? <span>{votesStr}</span> : <Chip label={votesStr} />}
      {plainText ? <span>{answersStr}</span> : <Chip label={answersStr}></Chip>}
      {post?.props?.canDelete && (
        <Chip
          variant="outlined"
          color={
            post.props.deleted
              ? 'error'
              : post.props.locked
                ? 'warning'
                : post.props.approved
                  ? 'success'
                  : undefined
          }
          label={['deleted', 'locked', 'approved']
            .filter((k) => !!post.props[k])
            .join('. ')}
        ></Chip>
      )}
      <ViewCounter
        clientOnly
        variant={plainText ? 'plaintext' : 'listitem'}
        componentKey={post?.props?.viewCounter?.component}
        data={post?.props?.viewCounter}
      />
    </CardContent>
  );
};

const Posts = ({ component }) => {
  const sticky = component?.children?.filter((post) => post.props.sticky) || [];
  const nonSticky =
    component?.children?.filter((post) => !post.props.sticky) || [];

  return (
    <FlexBox sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {sticky?.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sticky.map((post) => {
            return <Post {...post} />;
          })}
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {nonSticky.map((post) => {
          return <Post {...post} />;
        })}
      </Box>
    </FlexBox>
  );
};
const Header = ({ pageSize, setPageSize }) => {
  return (
    <CardHeader
      title={
        <FlexBox sx={{ alignItems: 'center' }}>
          <Typography variant="h5">All Questions</Typography>
        </FlexBox>
      }
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap-reverse',
        justifyContent: 'center',
        alignContent: 'center',
      }}
      action={<NewPostButton />}
    ></CardHeader>
  );
};

export const PageSize = ({ pageSize, setPageSize }) => {
  return (
    <Select
      size="small"
      value={pageSize}
      onChange={(e) => setPageSize(e.target.value)}
      sx={{ ml: 'auto', mr: 2 }}
    >
      <MenuItem value={5}>5</MenuItem>
      <MenuItem value={15}>15</MenuItem>
      <MenuItem value={25}>25</MenuItem>
      <MenuItem value={50}>50</MenuItem>
    </Select>
  );
};
export const NewPostButton = () => {
  return (
    <Button variant="contained" color="secondary" sx={{ ml: 'auto' }}>
      <Link
        to={`${FORUM_BASE_PATH}/new`}
        component={RouterLink}
        color={'#EEEEEE'}
      >
        Ask Question
      </Link>
    </Button>
  );
};
