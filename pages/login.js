import { Card, Form, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from 'next/router';
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";


export default function Login(props){
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('');
    const [favourites, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    const router = useRouter();

    async function updateAtoms(){
        setFavouritesList(await getFavourites()); 
        setSearchHistory(await getHistory()); 
    }
    

    async function handleSubmit(e) 
    {
        e.preventDefault();
        // console.log('TODO: Submit Form');
        try{
            await authenticateUser(user, password);
            await updateAtoms();
            router.push('/favourites')
        }
        catch(err)
        {
            setWarning(err.message)
        }
    }

  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label><Form.Control type="text" id="userName" name="userName" value={user} onChange={e => setUser(e.target.value)} />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label><Form.Control type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}

        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
    </>
  );
}