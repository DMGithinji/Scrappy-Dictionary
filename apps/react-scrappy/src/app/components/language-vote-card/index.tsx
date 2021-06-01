import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';
import { SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY } from '../../queries/translations.queries';
import { useLocalStorage } from '../../hooks/use-local-storage.hook';

const USER_LANGUAGE_VOTES = 'user_language_votes';
export function LanguageVoteCard() {
  const langsData = useQuery(SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY);
  const unSupportedLangs: ILanguage[] = langsData?.data?.unsupportedLanguages;

  /**
   * Tracks user's cast votes in local storage
   * Facilitates avoiding multiple casts
   */
  const votedLanguages: string[] = JSON.parse(localStorage.getItem(USER_LANGUAGE_VOTES));
  const [votedLangs, setLocalStorageVotes] = useLocalStorage(USER_LANGUAGE_VOTES, votedLanguages);


  // Boolean used to track if user has voted for current language-set
  const [hasVoted, setHasVoted] = useState(null);
  useEffect(() => {
    const hasVotedForSet = ( !votedLangs || !votedLangs.length || !unSupportedLangs)
     ? false
     : !!votedLangs
          .filter(l => unSupportedLangs
                        .map(l => l.language)
                        .includes(l))
          .length;

    setHasVoted(hasVotedForSet);

    return () => null;
  }, [votedLangs, unSupportedLangs]);

  // Enable casting a vote
  const [votedLang, setVote] = useState(null);
  useEffect(() => {

    if (hasVoted) { return }

    // 1. Will update local storage
    if (votedLang) {
      const voted = !votedLangs
                      ? [votedLang]
                      : [ ...votedLanguages, votedLang ];
      setLocalStorageVotes(voted);
    }

    // 2. Will trigger mutation to update DB

    return () => null;

  }, [votedLangs, votedLang, votedLanguages, hasVoted, setLocalStorageVotes]);




  return (
    <div className="">
      <p className="card-header text-dark" style={{fontSize: "18px"}}>
        Which language translations would you like to see added next? <br/>
        Let us know! 😏👇
      </p>

      <div className="container-fluid pt-3">
      {unSupportedLangs?.map((lang, i) => (

       <div className="mb-3" key={i}  onClick={() => setVote(lang.language)}>
          <div className="w-100 d-flex justify-content-between align-items-center text-capitalize pr-2 pl-2 rounded" style={{background: "#282828", height: 30}}>
            <div  style={{zIndex: 1000}} className="text-white text-left"><b>{lang.language}</b></div>
            <div  style={{zIndex: 1000}} className="text-white "><b>{lang.votes * 10}%</b></div>
          </div>

            {hasVoted ?
                <div className="progress" style={{height: "25px", marginTop: "-28px", zIndex: 1}}>
                  <div
                    className="progress-bar rounded bg-warning"
                    role="progressbar"
                    style={{height: "25px", width:`${lang.votes * 10}%`}}
                    aria-valuenow={lang.votes}
                    aria-valuemin={0}
                    aria-valuemax={10}>
                  </div>
              </div> : ''
            }

       </div>
      ))}

      </div>



      <div className="card-footer">
      <p>
        The first language to hit <b>100%</b> votes will have it's crowd-sourced language translations added to Scrappy by the end of the week 😀😎.
      </p>
      </div>
    </div>
  );
}
