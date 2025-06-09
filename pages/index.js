import Head from 'next/head';
import FridgeFinds from '../components/FridgeFinds';

export default function Home() {
    return (
        <>
            <Head>
                <title>FridgeFinds - Recipe Discovery App</title>
                <meta name="description" content="Discover amazing recipes with ingredients you already have!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FridgeFinds />
        </>
    );
}