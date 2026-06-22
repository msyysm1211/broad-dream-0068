import Image from 'next/image';

export default function ImageTestPage() {
  const isGatewayMode = !!process.env.NEXT_PUBLIC_PCG_IMAGE_URL;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Image Optimization Test</h1>
      <p
        style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}
      >
        Mode:{' '}
        <strong>
          {isGatewayMode
            ? 'Gateway optimization'
            : 'Direct URL (set NEXT_PUBLIC_PCG_IMAGE_URL to enable Gateway)'}
        </strong>
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Responsive Image</h2>
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          alt="Responsive test image"
          width={640}
          height={400}
          quality={75}
          style={{ borderRadius: '8px' }}
        />
      </section>

      <section>
        <h2>Multiple Sizes</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Image
            src="https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Medium test image"
            width={320}
            height={240}
            quality={75}
            style={{ borderRadius: '8px' }}
          />
          <Image
            src="https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"
            alt="Small test image"
            width={320}
            height={240}
            quality={75}
            style={{ borderRadius: '8px' }}
          />
        </div>
      </section>
    </main>
  );
}
