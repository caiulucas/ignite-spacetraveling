import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
