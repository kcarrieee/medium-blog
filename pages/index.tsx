import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity'
import { Post } from '../typings'

interface Props{
  posts: [Post];
}

const Home= ({posts}:Props) => {
  return (
    <div >
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main>
        <Banner/>
        
        {/* posts */}
      </main>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `
    *[_type == "post"]{
      _id,
      title,
      author -> {
        name,
        image
      },
      description,
      mainImage,
      slug
    }
  `;

  const posts = await sanityClient.fetch(query);
  return {
    props:{
      posts,
    }
  }

}

export default Home
