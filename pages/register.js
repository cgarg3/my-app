import { Card, Form, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import { registerUser } from "@/lib/authenticate";
import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form'


export default function Register(props){
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [warning, setWarning] = useState('');
    // const [favourites, setFavouritesList] = useAtom(favouritesAtom);
    // const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    const router = useRouter();

    // async function updateAtoms(){
    //     setFavouritesList(await getFavourites()); 
    //     setSearchHistory(await getHistory()); 
    // }
    // const { register, handleSubmit, formState: { errors } } = useForm()
    

    async function handleSubmit(e) 
    {
        e.preventDefault();
        // console.log('TODO: Submit Form');
        try{
            await registerUser(user, password, password2);
            // await updateAtoms();
            router.push('/login')
        }
        catch(err)
        {
            setWarning(err.message)
        }
    }

  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Register</h2>Register for an account:</Card.Body>
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
        <br />
        <Form.Group>
          <Form.Label>Confirm Password:</Form.Label><Form.Control type="password" id="password2" name="password2" value={password2} onChange={e => setPassword2(e.target.value)} />
        </Form.Group>

        { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}

        <br />
        <Button variant="primary" className="pull-right" type="submit">Register</Button>
      </Form>
    </>
  );
}