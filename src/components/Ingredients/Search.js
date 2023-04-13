import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useFetch from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  const { isLoading, data, error, sendRequest, clear } = useFetch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const fetchIngredients = async () => {
          sendRequest(
            `https://react-http-b5876-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json`,
            'GET'
          );
        };
        fetchIngredients();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    console.log(data);
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      if (enteredFilter === '')
        for (const key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount,
          });
        }
      else {
        for (const key in data) {
          if (data[key].title.includes(enteredFilter))
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount,
            });
        }
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients, enteredFilter]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
