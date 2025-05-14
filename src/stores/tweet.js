import { create } from 'zustand';
const initialStatus = {
    tweets: [],
};

export const useTweetStore = create((set, get) => ({
    ...initialStatus,

    resetStatus: () => set(initialStatus),
    getTweets: () => get().tweets,
    createTweet: (tweet) => 
        set( state => ({
            tweets: [tweet, ...state.tweets]
        })),
    updateTweet: (updatedTweet) =>
        set( state => ({
            tweets: state.tweets.map(tweet => tweet.id === updatedTweet.id ? updatedTweet : tweet)
        }),
    ),        
    deleteTweet: (tweetIds) =>
        set( state => ({
            tweets: state.tweets.filter(tweet => !tweetIds.includes(tweet.id))
        }),
    ),
    setTweets: (tweets) => 
        set( state => ({
            tweets
        })),
}));