module.exports = {
   plugins: [
      'gatsby-plugin-typescript',
      'gatsby-plugin-react-helmet',
      'gatsby-plugin-material-ui',
      {
         resolve: 'gatsby-plugin-prefetch-google-fonts',
         options: {
            fonts: [
               {
                  family: 'Roboto',
                  variants: ['400'],
               },
            ],
         },
      },
   ],
};
