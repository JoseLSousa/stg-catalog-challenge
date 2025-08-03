import Image from 'next/image';

export default async function Carousel() {


    return (
        <div className="container justify-center items-center flex mx-auto mt-4">
            <Image
                src="/banner.jpg"
                alt="Banner"
                width={1024}
                height={300}
                className="object-cover"
            />
        </div>
    )
}