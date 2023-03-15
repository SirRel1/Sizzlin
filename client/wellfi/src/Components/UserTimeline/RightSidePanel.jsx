import React, { useState, useEffect } from "react";

function RightSidePanel() {
  const [quotes, setQuotes] = useState([]);
  const [displayedQuotes, setDisplayedQuotes] = useState([]);

  useEffect(() => {
    // Fetch the quotes data from the JSON file
    fetch("/quotes.json")
      .then((response) => response.json())
      .then((data) => {
        // Shuffle the order of the quotes
        const shuffledQuotes = data.quotes.sort(() => 0.5 - Math.random());
        setQuotes(shuffledQuotes);
        // Display the first 5 quotes
        setDisplayedQuotes(shuffledQuotes.slice(0, 5));
      });
  }, []);

  const handleNextQuotes = () => {
      // Get the next 5 quotes from the shuffled array
      const nextQuotes = quotes.slice(
          displayedQuotes.length,
          displayedQuotes.length + 5
          );
          // If there are no more quotes left, shuffle the array again and start over
          const shuffledQuotes = nextQuotes.length
          ? [...displayedQuotes, ...nextQuotes]
          : quotes.sort(() => 0.5 - Math.random());
          setDisplayedQuotes(shuffledQuotes);
          
  };

  return (
    <div className="right-side-panel">
      <b>Quotes for the Day!</b>
      <hr />
      <ul>
        {displayedQuotes.map((quote) => (
          <li key={quote.id}>
            <p>"{quote.text}"</p>
            <p>- {quote.author}</p>
            <hr />
          </li>
        ))}
      </ul>
      <button className="followTag" onClick={() => handleNextQuotes()}>Next 5 Quotes</button>
    </div>
  );
}

export default RightSidePanel;
