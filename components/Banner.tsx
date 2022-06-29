
const Banner = () => {
  return (
    <div className="bg-yellow-400 w-full border-y border-black">
    <div className="flex justify-between items-center max-w-10xl mx-auto py-16 lg:py-0">
    <div className="px-5 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif"><span className="underline decoration-3" >Medium</span> is a place to write, read and connect.</h1>
        <h2 className="max-w-xl">It's easy and free to post your thinking on any topic and connect with millions of readers. It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
    </div>
    <img className="hidden md:inline-flex h-32 lg:h-full" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="logo" />
    </div>
    </div>
  )
}

export default Banner