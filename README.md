# GoHarsha.com

This repository hosts the source code of [GoHarsha.com](https://goharsha.com), served via GitHub Pages. It uses a custom Jekyll theme (not a GEM-based one) built with Jekyll 4.4 and [jekyll-paginate-v2](https://github.com/sverrirs/jekyll-paginate-v2) for blog pagination and tag pages.

## Directory Structure

| Directory         | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| \_data            | Site collections data (navigation, social links, tutorial metadata)   |
| \_includes        | Partials organized into `components/` and `structure/` subdirectories |
| \_layouts         | Layout templates (post, page, post_listing, autopage_tags, tutorials) |
| \_posts           | Blog posts in Markdown format                                         |
| \_sass            | Source stylesheets                                                    |
| assets            | Static assets — images, CSS, feed, sitemap, reveal.js, social icons   |
| pages             | All pages including the blog listing, 404, tags page, and tutorials   |
| ppt               | Slides for presentations                                              |
| .github/workflows | GitHub Actions deployment workflow                                    |

## Tech Stack

- **Jekyll 4.4** with kramdown (GFM) and Rouge syntax highlighting
- **jekyll-paginate-v2** for blog pagination and auto-generated tag pages
- **Ruby 3.3** (managed via [mise](https://mise.jdx.dev))
- **Node.js** tooling for image minification

## Deployment

The site is deployed automatically via [GitHub Actions](.github/workflows/deploy.yml). On every push to `master`, the workflow builds the site and deploys it to GitHub Pages.

## Development

```sh
# Install dependencies
bundle install

# Serve locally (with development config)
bundle exec jekyll serve --watch --config _config.yml,_development.yml

# Minify images (after build)
./scripts/minify-images.js _site
```
