import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity'
import { Post } from '../typings'
import Link from "next/link"

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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post)=>(
            <Link href={`/post/${post.slug.current}`} key={post._id} >
              <div className='border rounded-lg group cursor-pointer overflow-hidden'>
                <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt={post.title} />
                <div className='flex justify-between p-5 bg-white'>
                  <div>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-xs'>{post.description} by {post.author.name}</p>
                  </div>
                  <div className='h-12 w-12 '>
                  <img className='object-cover h-full w-full rounded-full' src={urlFor(post.author.image).url()!} alt="Author" />
                  </div>
               </div>
              </div>

            </Link>
        ))}
        </div>
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
