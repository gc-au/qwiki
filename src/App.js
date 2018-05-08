import React, { Component } from "react";
import "./styles/index.css";
import "./styles/uikit/uikit.min.js";
import "./styles/uikit/uikit-icons.min.js";

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
        fetch(`https://en.wikipedia.org/api/rest_v1/page/random/summary`)
            .then(res => res.json())
            .then(data => {
                this.setState({ random_article: data });
            });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.searchArticle();
    };

    searchArticle() {
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${this.state.query}`)
            .then(res => res.json())
            .then(data => {
                return this.setState({ random_article: data });
            });
    }

    fetchRelated(title) {
        fetch(`https://en.wikipedia.org/api/rest_v1/page/related/${title}`)
            .then(res => res.json())
            .then(data => {
                let article = data.pages[Math.floor(Math.random() * data.pages.length)];
                article.title = article.normalizedtitle;
                return this.setState({ random_article: article });
            });
    }

    handleChange(event) {
        this.setState({ query: event.target.value });
    }

    render() {
        const article = this.state.random_article;

        return (
            <div className="uk-container uk-padding uk-flex">
                {article && (
                    <div className="uk-width-1-1">
                        <h1 className="uk-heading-primary uk-heading-divider">{article.title}</h1>
                        {article.thumbnail && <img src={article.thumbnail.source} className="uk-align-right" />}
                        <h2>{article.description}</h2>
                        <p>{article.extract}</p>
                        <div className="uk-flex uk-flex-between">
                            <input
                                type="button"
                                onClick={() => window.open(`https://en.wikipedia.org/api/rest_v1/page/pdf/${article.title}`, "_blank")}
                                value="Download as PDF"
                                className="uk-button uk-button-default uk-width-medium"
                            />
                            <input
                                className="uk-button uk-button-default uk-width-medium"
                                type="button"
                                onClick={() => this.fetchRelated(article.title)}
                                value="Related article"
                            />
                        </div>
                        <div className="uk-flex uk-flex-between uk-margin">
                            <form onSubmit={this.handleSubmit} className="uk-search uk-search-default uk-width-medium">
                                <button type="submit" href="" class="uk-search-icon-flip" data-uk-search-icon="" />
                                <input className="uk-search-input" type="search" value={this.state.query} onChange={this.handleChange} />
                            </form>
                            <button
                                onClick={() => {
                                    this.getRandom();
                                }}
                                className="uk-button uk-button-primary uk-width-medium">
                                Random
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
