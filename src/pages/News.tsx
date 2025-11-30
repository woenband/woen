import './News.css';

const News = () => {
const newsItems = [
    {
        date: 'November 30, 2025',
        title: 'Website Launch',
        content: 'We are proud to announce the launch of our official website. Stay updated with the latest news, upcoming concert dates, media releases, and exclusive content.'
    },
    {
        date: 'June 7, 2025',
        title: 'Live Performance at Guitart',
        content: 'We performed our debut setlist live at Guitart in Apeldoorn, marking a significant milestone in the band\'s journey.'
    },
    {
        date: 'November 28, 2022',
        title: 'Formation of Wōen',
        content: 'Wōen emerged in late 2022, evolving from the former metal project Vitreum. The band has forged a distinctive sound characterized by blackened symphonic doom metal, complemented by profound and introspective lyrics.'
    },
];

  return (
    <div className="news">
      <div className="news-container">
        <div className="news-list">
          {newsItems.map((item, index) => (
            <article key={index} className="news-article">
              <div className="news-date">{item.date}</div>
              <h2 className="news-heading">{item.title}</h2>
              <p className="news-content">{item.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
