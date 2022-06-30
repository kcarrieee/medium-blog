import { GetStaticProps } from 'next'
import Head from 'next/head';
import { useState } from 'react';
import Header from '../../components/Header'
import {sanityClient, urlFor} from '../../sanity'
import { Post} from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'


interface Iform {
    _id: string;
    name:string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}


const Post = ({post}:Props): JSX.Element => {
      
    const [submitted, setSubmitted] = useState(false);
    const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<Iform>();
    
    const onSubmit: SubmitHandler<Iform> = (data) => {
   

    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        
        setSubmitted(true);
      })
      .catch((err) => {
        
        setSubmitted(false);
      });
  };
    

  return (
    <>
        <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/images/logo/medium-1.svg" />
        </Head>
        <Header/>
        <div>
        <img className='w-full h-80 object-cover' src={urlFor(post.mainImage).url()!} alt="post" />
        <article className='max-w-3xl mx-auto p-3'>
            <h1 className='text-3xl mt-10 mb-3 '>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>

            <div className='flex items-center space-x-2'>
                     <img className='h-10 w-10 object-cover rounded-full' src={urlFor(post.author.image).url()!} alt="author" />
                     <p className='font-extralight text-sm'>Blog post by {post.author.name} - Published at {new Date(post._createdAt).toLocaleString()}</p>
            </div>
            <div className='mt-10'>
                <PortableText
                className=''
                 dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                 projectId={ process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                 content= {post.body || []}
                 serializers={{
                    h1:(props:any) => (
                        <h1 className='text-2xl font-bold my-5' {...props}/>
                    ),
                    h2:(props:any) => (
                        <h1 className='text-xl font-bold my-5' {...props}/>
                    ),
                    li:({children}:any) => (
                       <li className='ml-4 list-disc'>{children}</li>
                    ),
                    link:({href, children}:any) => (
                      <a href={href} className='text-blue-600'> {children}</a>
                    ),
                 }}
                />
            </div>
        </article>
        <hr />
         {submitted ? (
          <div className="my-10 mx-auto flex max-w-2xl flex-col p-10 ">
            <h3>Thankyou for submitting your comment</h3>
            <p>Once it has been approved, it will appear below! </p>
          </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>
            <h3 className='mt-2 mb-2 text-2xl font-bold'>Leave a comment below!</h3>
            <input 
            type="hidden" 
            name="_id"
             value={post._id}
            />
            <label className='block mb-5 '>
                <span className='text-gray-700'>Name</span>
                <input  {...register('name', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full'  placeholder='username' type="text" />
            </label>
              <label className='block mb-5 '>
                <span className='text-gray-700'>Email</span>
                <input {...register('email', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full' placeholder='username' type="text" />
            </label>
              <label className='block mb-5 '>
                <span className='text-gray-700'>Comment</span>
                <textarea {...register('comment', { required: true })} className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full' placeholder='username' rows={8} />
            </label>

            <div className="flex flex-col">
              {errors.name && (
                <span className="text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                  - The Comment Field is required
                </span>
              )}
              {errors.email && (
                <span className="text-red-500">
                  - The Email Field is required
                </span>
              )}
            </div>
         <input type="submit"  className='border px-4 py-1  rounded-full border-green-600 w-24'/>
        </form>)}
        {/* Comments */}
        <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow ">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />

            {post.comments.map((comment) => {
                return (
                <div key={comment._id}>
                    <p>
                    <span className="text-gray-700">{comment.name}: </span>
                    {comment.comment}
                    </p>
                </div>
                );
            })}
            </div>
        </div>
    </>
  )
}

export default Post

export const getStaticPaths =async()=>{
    const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`
    const posts = await sanityClient.fetch(query);
    const paths = posts.map((post: Post )=>(
        {
            params:{
                slug: post.slug.current
            }
        }
    ))
    return {
        paths,
        fallback: 'blocking'

    }


}

export const getStaticProps: GetStaticProps = async({params})=>{
    const query = `
        *[_type == "post" && slug.current == $slug][0]{
            _id,
            _createdAt,
            title,
            author ->{
                name,
                image
            },
            "comments":*[
                _type == "comment" && 
                post.ref == ^._id &&
                approved == true
            ],
            description,
            mainImage,
            slug,
            body
        }
    `
    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });
    if (!post){
        return {
            notFound: true
        }
    }

    return{
        props:{
            post,
        },
        revalidate: 100,
    }

}