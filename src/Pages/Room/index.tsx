import React, { useState } from 'react';
import styled from 'styled-components';
import GameStartButton from './Components/GameStartButton';
import TeamChangeButton from './Components/TeamChangeButton';
import SetGameLength from './Components/SetGameLength';

const dummyUser = {
  userId: 394998,
  nickname: 'gamja',
};

const dummyFirstTeam = [
  {
    userId: 1,
    nickname: 'byukim',
  },
  {
    userId: 2,
    nickname: 'sjo',
  },
  {
    userId: 3,
    nickname: 'yeju',
  },
];

const dummySecondTeam = [
  {
    userId: 6,
    nickname: 'yeoyoon',
  },
  {
    userId: 394998,
    nickname: 'gamja',
  },
  {
    userId: 122,
    nickname: 'jinbekim',
  },
];

interface IUser {
  userId: number;
  nickname: string;
}
interface ITeam {
  firstTeam: {
    users: IUser[];
  };
  secondTeam: {
    users: IUser[];
  };
}

const captain = {
  uid: 394998,
  username: 'yeoyoon',
};

export default function Game() {
  const [teamNames, setTeamNames] = useState({
    firstTeamName: 'White',
    secondTeamName: 'Black',
  });
  const [team, setTeam] = useState<ITeam>({
    firstTeam: {
      users: [...dummyFirstTeam],
    },
    secondTeam: {
      users: [...dummySecondTeam],
    },
  });

  const { firstTeamName, secondTeamName } = teamNames;
  const { firstTeam, secondTeam } = team;

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setTeamNames({
      ...teamNames,
      [name]: value,
    });
  };

  const onClickStartButton = () => {
    if (firstTeam.users.length < 2 || secondTeam.users.length < 2 || captain.uid !== dummyUser.userId) {
      return;
    }
    console.log('start');
  };

  return (
    <Container>
      <TeamContainer>
        <input name='firstTeamName' value={firstTeamName} onChange={onChangeName} type='text' />
        <UserList>
          {firstTeam.users.length ? (
            firstTeam.users.map((user) => <User key={user.userId}>{user.nickname}</User>)
          ) : (
            <User>참가하세오,,!</User>
          )}
        </UserList>
      </TeamContainer>
      <TeamChangeButton team={team} setTeam={setTeam} />
      <TeamContainer>
        <input name='secondTeamName' value={secondTeamName} onChange={onChangeName} type='text' />
        <UserList>
          {secondTeam.users.length ? (
            secondTeam.users.map((user) => <User key={user.userId}>{user.nickname}</User>)
          ) : (
            <User>참가하세오,,!</User>
          )}
        </UserList>
      </TeamContainer>
      <SetGameLength captain={captain} />
      <GameStartButton team={team} onClickStartButton={onClickStartButton} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  gap: 5rem;
`;

const TeamContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 60rem;
  input {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 2rem;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 128, 0.6);
    &:focus {
      outline: none;
    }
  }
`;

const UserList = styled.ul`
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  height: 100%;
  border: 1px solid black;
  margin-bottom: 3rem;
  border-radius: 1rem;
`;

const User = styled.li`
  padding: 3rem 1rem;
  font-size: 2rem;
  text-align: center;
`;
