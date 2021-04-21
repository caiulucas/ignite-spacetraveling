import { DefaultClient } from '@prismicio/client/types/client';
import Prismic from '@prismicio/client';

import { Document } from '@prismicio/client/types/documents';
import { HttpClientOptions } from '@prismicio/client/types/HttpClient';

const apiEndpoint = 'https://your-repo-name.cdn.prismic.io/api/v2';
const accessToken = '';

const linkResolver = (doc: Document): string => {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
};
// Client method to query from the Prismic repo

const createClientOptions = (req = null, prismicAccessToken = null): any => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

const Client = (req = null): DefaultClient =>
  Prismic.client(apiEndpoint, createClientOptions(req, accessToken));

const Preview = async (req, res): Promise<void> => {
  const { token: ref, documentId } = req.query;
  const redirectUrl = await Client(req)
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });
  res.writeHead(302, { Location: `${redirectUrl}` });
  return res.end();
};

export default Preview;
