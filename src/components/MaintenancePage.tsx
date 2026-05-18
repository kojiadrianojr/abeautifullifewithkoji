import { ConfigService } from '@/services';

export default function MaintenancePage() {
	const coupleNames = ConfigService.getCoupleNames();

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #FFFAF0 0%, rgba(195, 177, 225, 0.12) 40%, rgba(245, 202, 195, 0.12) 100%)',
				fontFamily: "'Inter', Arial, sans-serif",
				padding: '2rem',
				textAlign: 'center',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Decorative watercolor blobs */}
			<div
				style={{
					position: 'absolute',
					top: '-80px',
					left: '-80px',
					width: '320px',
					height: '320px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(195, 177, 225, 0.25) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: '-60px',
					right: '-60px',
					width: '280px',
					height: '280px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(245, 202, 195, 0.3) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '40%',
					right: '10%',
					width: '160px',
					height: '160px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(168, 216, 234, 0.2) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Content card */}
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					maxWidth: '560px',
					width: '100%',
				}}
			>
				{/* Decorative top flourish */}
				<div
					style={{
						fontSize: '2rem',
						marginBottom: '0.5rem',
						opacity: 0.6,
						letterSpacing: '0.5em',
						color: '#C3B1E1',
					}}
				>
					✦ ✦ ✦
				</div>

				{/* Couple names in script font */}
				<h1
					style={{
						fontFamily: "'Great Vibes', cursive",
						fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
						fontWeight: 400,
						color: '#6B4E71',
						margin: '0 0 0.25rem',
						lineHeight: 1.2,
					}}
				>
					{coupleNames}
				</h1>

				{/* Divider */}
				<div
					style={{
						margin: '1.25rem auto',
						width: '120px',
						height: '1px',
						background: 'linear-gradient(90deg, transparent, rgba(195, 177, 225, 0.7), transparent)',
					}}
				/>

				{/* Main message */}
				<h2
					style={{
						fontFamily: "'Cormorant Garamond', Georgia, serif",
						fontSize: 'clamp(1.4rem, 4vw, 2rem)',
						fontWeight: 500,
						color: '#4A3F5C',
						margin: '0 0 1rem',
						letterSpacing: '0.05em',
					}}
				>
					This page is under construction
				</h2>

				{/* Subtext */}
				<p
					style={{
						fontFamily: "'Inter', Arial, sans-serif",
						fontSize: '1rem',
						color: '#7A6E8A',
						margin: '0 0 2rem',
						lineHeight: 1.7,
						fontWeight: 300,
					}}
				>
					We&apos;re putting the finishing touches on something beautiful.
					<br />
					Please check back soon.
				</p>

				{/* Decorative bottom flourish */}
				<div
					style={{
						fontSize: '1.4rem',
						opacity: 0.45,
						color: '#F5CAC3',
					}}
				>
					🌸
				</div>
			</div>
		</div>
	);
}
