import React from 'react';

const DEFAULT_LOGO = 'https://wafflehacks-static.s3.us-west-2.amazonaws.com/logos/logo.png';

interface Props {
  title: string;
  subtitle?: string;
  logo?: string;
}

const Header = ({ title, subtitle, logo = DEFAULT_LOGO }: Props): JSX.Element => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <img className="mx-auto h-24 w-auto rounded-full" src={logo} alt="logo" />
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
    {subtitle && <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>}
  </div>
);

export default Header;
