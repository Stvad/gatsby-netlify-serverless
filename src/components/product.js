import React from 'react'
import { Link, graphql } from 'gatsby'

import styles from './product.module.css'
import fourOfour from './../pages/404.js'
import Layout from './layout'

const netlifyIdentity = require('netlify-identity-widget')

const NETLIFY_FUNC =
  'frosty-golick-42f3c1.netlify.com/.netlify/functions'
const NETLIFY_URL = 'https://frosty-golick-42f3c1.netlify.com'

export default class Product extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      reviews: [],
      loggedIn: false
    }
  }

  componentDidMount() {
    fetch(
      `https://${NETLIFY_FUNC}/fetchreviews?id=${
        this.props.data.markdownRemark.frontmatter.sku
      }`
    )
      .then(x => x.json())
      .then(x => {
        this.setState({ reviews: x })
      })

    if (netlifyIdentity.currentUser() != null) {
      this.setState({ loggedIn: true })
    }

    netlifyIdentity.on('login', user =>
      this.setState({ loggedIn: true })
    )
    netlifyIdentity.on('logout', () =>
      this.setState({ loggedIn: false })
    )
  }

  render() {
    if (
      this.props.data.markdownRemark.frontmatter.private &&
      !this.state.loggedIn
    ) {
      return fourOfour()
    }

    var formId = `product-${
      this.props.data.markdownRemark.frontmatter.sku
    }`

    const button = this.props.data.markdownRemark.frontmatter
      .private ? (
      <button type="button" className={`${styles.buyButton}`}>
        SOLD OUT
      </button>
    ) : (
      <button
        type="button"
        className={`${styles.buyButton} snipcart-add-item`}
        data-item-name={
          this.props.data.markdownRemark.frontmatter.name
        }
        data-item-id={this.props.data.markdownRemark.frontmatter.sku}
        data-item-image={
          this.props.data.markdownRemark.frontmatter.image
        }
        data-item-url={`${NETLIFY_URL}${
          this.props.location.pathname
        }`}
        data-item-price={
          this.props.data.markdownRemark.frontmatter.price
        }
        data-item-description={
          this.props.data.markdownRemark.frontmatter.desc
        }
      >
        Buy it now for{' '}
        {this.props.data.markdownRemark.frontmatter.price}$
      </button>
    )

    return (
      <Layout>
        <h1>{this.props.data.markdownRemark.frontmatter.name}</h1>
        <div className={styles.breadcrumb}>
          <Link to="/">Back to the products</Link>
        </div>
        <p>{this.props.data.markdownRemark.frontmatter.desc}</p>

        <section className="section__product">
          <figure className={styles.productFigure}>
            <img
              src={this.props.data.markdownRemark.frontmatter.image}
              alt={this.props.data.markdownRemark.frontmatter.name}
            />
          </figure>

          <article>
            {this.props.data.markdownRemark.frontmatter.description}
          </article>
          <div className={styles.actions}>{button}</div>
        </section>
        <section>
          <h3 className="reviews">Reviews</h3>

          <div className="reviews__list">
            {this.state.reviews.map(o => (
              <p key={o.number}>
                <div className="review__name">{o.name}</div>
                <div>{o.data.message}</div>
              </p>
            ))}
          </div>

          <form
            className="review__form"
            name={formId}
            method="POST"
            data-netlify-honeypot="bot-field"
            data-netlify="true"
          >
            <input type="hidden" name="form-name" value={formId} />
            <div className="field__form">
              <label>NAME</label>
              <input type="text" name="name" />
            </div>
            <div className="field__form">
              <label>EMAIL</label>
              <input type="email" name="email" />
            </div>
            <div className="field__form">
              <label>MESSAGE</label>
              <textarea name="message" />
            </div>

            <button className="button__form" type="submit">
              SEND
            </button>
          </form>
        </section>
      </Layout>
    )
  }
}

export const query = graphql`
  query productById($sku: String) {
    markdownRemark(frontmatter: { sku: { eq: $sku } }) {
      html
      frontmatter {
        sku
        loc
        price
        desc
        private
        name
        image
      }
    }
  }
`
