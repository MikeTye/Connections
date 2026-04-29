export const viewerContexts = {
  owner: { id: 'u1', relationship: 'owner' },
  sharedViewer: { id: 'u2', relationship: 'shared_link' },
  discoverViewer: { id: 'u3', relationship: 'discovery' },
};

export const profileData = {
  id: 'p1',
  name: 'Maya Chen',
  title: 'Product Operator • Community Builder',
  location: 'Seattle, WA',
  intents: ['Collaboration', 'Friendship', 'Dating (intentional)'],
  about: 'I design intentional systems for people who value depth, craft, and momentum.',
  lastUpdated: '2026-04-26',
  sections: [
    {
      id: 'values',
      type: 'values',
      title: 'Core Values',
      content: ['Curiosity over certainty', 'Kind directness', 'Long-term thinking'],
      visibility: 'public',
    },
    {
      id: 'looking-for',
      type: 'intent',
      title: 'What I\'m Looking For',
      content: 'People who follow through, communicate clearly, and care about building healthy dynamics.',
      visibility: 'shared',
    },
    {
      id: 'prompts',
      type: 'prompts',
      title: 'Conversation Prompts',
      content: [
        'What belief changed your life in the last 2 years?',
        'What does a great week feel like for you?',
      ],
      visibility: 'discovery',
    },
    {
      id: 'contact',
      type: 'contact',
      title: 'Contact Preferences',
      content: 'Share your context first. I usually respond within 48 hours.',
      visibility: 'private',
    },
  ],
};
