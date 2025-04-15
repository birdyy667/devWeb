import adidas from './logos/adidas.png';
import chanel from './logos/chanel.png';
import nike from './logos/nike.png';
import pullbear from './logos/pullbear.png';
import sephora from './logos/sephora.png';
import zara from './logos/zara.png';

const logos = [adidas, chanel, nike, pullbear, sephora, zara];

function LogosMarquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap py-6 bg-white">
      <div className="animate-marquee inline-block">
        {logos.concat(logos).map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`logo-${index}`}
            className="h-12 mx-8 inline-block"
          />
        ))}
      </div>
    </div>
  );
}

export default LogosMarquee;
