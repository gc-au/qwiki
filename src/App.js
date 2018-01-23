import React, { Component } from "react";
import "./App.css";
import logo from "./wikipedia_logo.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      random_article: null,
      query: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getRandom();
  }

  getRandom() {
    console.log(`getRandom`);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/random/summary`)
      .then(res => res.json())
      .then(data => {
        return this.setState({ random_article: data });
      });
  }

  handleEvent = event => {
    event.preventDefault();
    this.searchArticle();
  };

  searchArticle() {
    console.log(`Query: ${this.state.query}`);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${this.state.query}`)
      .then(res => res.json())
      .then(data => {
        return this.setState({ random_article: data });
      });
  }

  fetchRelated(title) {
    console.log(title);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/related/${title}`)
      .then(res => res.json())
      .then(data => {
        let article = data.pages[Math.floor(Math.random() * data.pages.length)];
        article.title = article.normalizedtitle;
        return this.setState({ random_article: article });
      });
  }

  handleChange(event) {
    console.log("handleChange");
    this.setState({ query: event.target.value });
  }

  render() {
    const article = this.state.random_article;

    return (
      <div>
        <header className="center">
          <button
            onClick={() => {
              this.getRandom();
            }}
          >
            Random
          </button>
          <img src={logo} alt="Wikipedia Logo" />
          <form onSubmit={this.handleEvent}>
            <input type="text" value={this.state.query} onChange={this.handleChange} />
            <input type="submit" value="Search" />
          </form>
        </header>
        {/* only render article if it exists */}
        {article && (
          <div>
            <div id="article">
              <h1>{article.title}</h1>
              <h2>{article.description}</h2>
              <div id="body">
                {article.thumbnail && <img src={article.thumbnail.source} alt={article.title} />}
                <p>{article.extract}</p>
              </div>
            </div>
            <div id="tools">
              <input type="button" onClick={() => window.open(`https://en.wikipedia.org/api/rest_v1/page/pdf/${article.title}`, "_blank")} value="Download Page as .PDF" />
              <input type="button" onClick={() => this.fetchRelated(article.title)} value="Show a related article" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
