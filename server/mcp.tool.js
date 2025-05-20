import { config } from "dotenv"
import { TwitterApi } from "twitter-api-v2"
config()


const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

export async function createPost(status) {
    const newPost = await twitterClient.v2.tweet(status)

    return {
        content: [
            {
                type: "text",
                text: `Tweeted: ${status}`
            }
        ]
    }
}


// import { config } from "dotenv";
// import { TwitterApi } from "twitter-api-v2";

// // Load environment variables
// config();

// // Initialize Twitter client
// const twitterClient = new TwitterApi({
//   appKey: process.env.TWITTER_API_KEY,
//   appSecret: process.env.TWITTER_API_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });

// /**
//  * Creates a new post on Twitter
//  * @param {string} status - The text content to tweet
//  * @returns {Object} Response containing the tweet information
//  */
// export async function createPost(status) {
//   try {
//     // Post to Twitter
//     const newPost = await twitterClient.v2.tweet(status);
    
//     // Return success response
//     return {
//       content: [
//         {
//           type: "text",
//           text: `Successfully tweeted: "${status}"`
//         }
//       ]
//     };
//   } catch (error) {
//     console.error('❌ Twitter API error:', error);
    
//     // Return error response
//     return {
//       content: [
//         {
//           type: "text",
//           text: `Failed to tweet: ${error.message}`
//         }
//       ]
//     };
//   }
// }


