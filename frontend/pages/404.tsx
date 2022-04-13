import type { NextPage } from 'next';

const NotFound: NextPage = () => (
  <div className="max-h-screen text-center flex flex-col align-middle justify-center pt-48">
    <div>
      <h1 className="inline-block border-r border-gray-900 m-0 text-2xl font-bold pr-4 leading-10">404</h1>
      <div className="inline-block text-left h-4 align-middle pl-2 leading-10">
        <h2 className="text-lg font-normal m-0 p-0 -mt-2">This page could not be found</h2>
      </div>
    </div>
  </div>
);

export default NotFound;
