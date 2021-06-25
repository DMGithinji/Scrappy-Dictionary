import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useMutation, useQuery } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';
import {
  SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY,
  SET_LANGUAGE_VOTE_QUERY,
} from '../../queries/translations.queries';
import { useLocalStorage } from '../../hooks/use-local-storage.hook';

const USER_LANGUAGE_VOTES = 'user_language_votes';
export function LanguageVoteCard() {
  const { loading, data, refetch } = useQuery(
    SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY
  );
  const [saveToDb, res] = useMutation(SET_LANGUAGE_VOTE_QUERY, {
    refetchQueries: [{ query: SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY }],
  });
  const unSupportedLangs: ILanguage[] = data?.unsupportedLanguages;

  /**
   * Tracks user's cast votes in local storage
   * Facilitates avoiding multiple casts
   */
  const votedLanguages: string[] = JSON.parse(
    localStorage.getItem(USER_LANGUAGE_VOTES)
  );
  const [votedLangs, setLocalStorageVotes] = useLocalStorage(
    USER_LANGUAGE_VOTES,
    votedLanguages
  );

  // Boolean used to track if user has voted for current language-set
  const [hasVoted, setHasVoted] = useState(null);
  useEffect(() => {
    const hasVotedForSet =
      !votedLangs || !votedLangs.length || !unSupportedLangs
        ? false
        : !!votedLangs.filter((l) =>
            unSupportedLangs.map((l) => l.language).includes(l)
          ).length;

    setHasVoted(hasVotedForSet);

    return () => null;
  }, [votedLangs, unSupportedLangs]);

  // Enable casting a vote
  const [vote, setVote] = useState(null);
  useEffect(() => {
    if (hasVoted || !vote) {
      return;
    }

    saveToDb({ variables: { language: vote } });
    refetch();

    // If update successful, update localStorage
    const voted = !votedLangs ? [vote] : [...votedLanguages, vote];
    setLocalStorageVotes(voted);
    setHasVoted(true);

    return () => null;
  }, [
    votedLangs,
    vote,
    votedLanguages,
    hasVoted,
    saveToDb,
    setLocalStorageVotes,
    refetch,
  ]);

  return (
    <div className="">
      {loading ? (
        <div className="container pt-3">
          <Skeleton height={18} className="mb-2 d-block" />
          <Skeleton height={18} width={150} className="mb-2 d-block" />
          <Skeleton height={18} width={200} className="mb-2 d-block" />
        </div>
      ) : (
        hasVoted
          ? (<p className="card-header text-dark" style={{ fontSize: '18px' }}>
                Thanks for voting <span role="img" aria-label="thumbsUp">👍🏽</span> <br />
                Keep posted to see whether your prefered language will be added! 😉
            </p>)
          : <p className="card-header text-dark" style={{ fontSize: '18px' }}>
              Which language translations would you like to see added next? <br />
              Let us know! 😏👇
            </p>
      )}

      <div className="container-fluid pt-3">
        {unSupportedLangs ? (
          unSupportedLangs.map((lang, i) => (
            <div
              className="mb-3"
              key={i}
              role="button"
              onClick={() => setVote(lang.language)}
            >
              <div
                className="w-100 d-flex justify-content-between align-items-center text-capitalize pr-2 pl-2 rounded"
                style={{ background: '#282828', height: 30 }}
              >
                <div style={{ zIndex: 1000 }} className="text-white text-left">
                  <b>{lang.language}</b>
                </div>
                {hasVoted ? (
                  <div style={{ zIndex: 1000 }} className="text-white ">
                    <b>{lang.votes * 10}%</b>
                  </div>
                ) : (
                  ''
                )}
              </div>

              {hasVoted ? (
                <div
                  className="progress"
                  style={{ height: '25px', marginTop: '-28px', zIndex: 1 }}
                >
                  <div
                    className="progress-bar rounded bg-warning"
                    role="progressbar"
                    style={{ height: '25px', width: `${lang.votes * 10}%` }}
                    aria-valuenow={lang.votes}
                    aria-valuemin={0}
                    aria-valuemax={10}
                  ></div>
                </div>
              ) : (
                ''
              )}
            </div>
          ))
        ) : (
          <Skeleton count={5} height={25} className="w-100 mb-3 d-block" />
        )}
      </div>

      <div className="card-footer">
        {loading ? (
          <div>
            <Skeleton count={2} height={10} className="w-100 mb-1 d-block" />
            <Skeleton count={1} height={10} className="w-50 mb-1 d-block" />
          </div>
        ) : (
          <p>
            The first language to hit <b>100%</b> votes will have it's
            crowd-sourced language translations added after an hour or so 😎.
          </p>
        )}
      </div>
    </div>
  );
}
