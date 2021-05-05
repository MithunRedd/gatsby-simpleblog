const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions
    
    const result = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              frontmatter {
                path
              }
            }
          }
          pageInfo {
            currentPage
            hasNextPage
            hasPreviousPage
            itemCount
            pageCount
            totalCount
          }
        }
      }
    `
    )
    
    if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const postTemplate = path.resolve("src/templates/blogTemplate.js")

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const path = node.frontmatter.path
    createPage({
      path: node.frontmatter.path,
      component: postTemplate,
      // In your blog post template's graphql query, you can use pagePath
      // as a GraphQL variable to query for data from the markdown file.
      context: {
        pagePath: path,
      },
    })
  })
}
