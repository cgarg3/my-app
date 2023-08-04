import React from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai'; // Import the useAtom hook
import { Card, ListGroup, Button } from 'react-bootstrap';
import { searchHistoryAtom } from '../store'; // Import the searchHistoryAtom
import styles from '@/styles/History.module.css'; // Import the CSS Module
import { removeFromHistory } from '../lib/userData';


export default function History() {
  const router = useRouter();

  // Get the searchHistory from the searchHistoryAtom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // Function to handle when a search history item is clicked
  const historyClicked = (e, index) => {
    e.stopPropagation(); // stop the event from triggering other events
    router.push(`/artwork?${searchHistory[index]}`);
  };

  // Function to handle when the remove button of a search history item is clicked
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // stop the event from triggering other events
    try {
      setSearchHistory(await removeFromHistory(searchHistory[index]));
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };


  // Create a list of parsed search queries from the searchHistory
  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  return (
    <div className="mt-5">
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <Card.Text>Nothing Here. Try searching for some artwork.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item key={index} className={styles.historyListItem} onClick={e => historyClicked(e, index)}>
              {Object.keys(historyItem).map((key, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span>&nbsp;</span>}
                  {key}: <strong>{historyItem[key]}</strong>
                </React.Fragment>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={e => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
