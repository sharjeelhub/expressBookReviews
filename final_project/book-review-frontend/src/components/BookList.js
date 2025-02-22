import { useEffect, useState } from 'react';
import axios from 'axios';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('https://sharjeelahm2-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
      .then(res => setBooks(Object.values(res.data)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      {books.map(book => (
        <div key={book.isbn} className="card mb-3">
          <div className="card-body">
            <h5>{book.title}</h5>
            <p>By {book.author}</p>
            <ReviewForm isbn={book.isbn} />
          </div>
        </div>
      ))}
    </div>
  );
}