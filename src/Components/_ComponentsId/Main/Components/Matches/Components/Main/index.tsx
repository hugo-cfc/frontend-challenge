import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CompetitionContext from '../../../../../../../Context/CompetitionContext';

import Match from './Components/Match';
import Loader from './Components/Loader';

import MatchData from '../../../../../../../utils/MatchData';
import isValidId from '../../../../../../../utils/isValidId';

import { Container } from './style';
import axios from 'axios';

interface MatchesData {
  data: {
    matches: [];
  };
}

const Main: React.FC = () => {
  const { setIsErrorRequest, matchday, setIsMatchesReady, isMatchesReady } =
    useContext(CompetitionContext);

  const { query, isReady } = useRouter();

  useEffect(() => {
    setIsMatchesReady(false);

    if (!isReady || !matchday) return;

    if (!isValidId(String(query.id))) {
      setIsErrorRequest(true);
      return;
    }

    (async () => {
      try {
        const { data }: MatchesData = await axios.get(
          `/api/matches/${query.id}?matchday=${matchday}`
        );
        setIsMatchesReady(true);
        setMatches(data.matches);
      } catch (error) {
        setIsErrorRequest(true);
      }
    })();
  }, [matchday, query.id]);

  const [matches, setMatches] = useState([]);

  return (
    <Container>
      {matches.map((match: MatchData) => {
        return <Match key={match.id} match={match} />;
      })}

      {!isMatchesReady && <Loader />}
    </Container>
  );
};

export default Main;
