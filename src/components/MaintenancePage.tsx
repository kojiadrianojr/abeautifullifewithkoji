import { fontStyles } from '@/lib/fontStyles';
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
				background: 'linear-gradient(135deg, var(--color-background) 0%, rgba(212,160,23,0.08) 40%, rgba(192,57,43,0.08) 100%)',
				...fontStyles.body,
				padding: '2rem',
				textAlign: 'center',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Decorative blobs */}
			<div
				style={{
					position: 'absolute',
					top: '-80px',
					left: '-80px',
					width: '320px',
					height: '320px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%)',
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
					background: 'radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 70%)',
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
					background: 'radial-gradient(circle, rgba(255,243,205,0.4) 0%, transparent 70%)',
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
						color: 'var(--color-secondary)',
					}}
				>
					✦ ✦ ✦
				</div>

				{/* Couple names in script font */}
				<h1
					style={{
						...fontStyles.heading,
						fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
						fontWeight: 400,
						color: 'var(--color-primary)',
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
						background: 'linear-gradient(90deg, transparent, var(--color-secondary), transparent)',
					}}
				/>

				{/* Main message */}
				<h2
					style={{
						...fontStyles.display,
						fontSize: 'clamp(1.4rem, 4vw, 2rem)',
						fontWeight: 500,
						color: 'var(--color-foreground)',
						margin: '0 0 1rem',
						letterSpacing: '0.05em',
					}}
				>
					This page is under construction
				</h2>

				{/* Subtext */}
				<p
					style={{
						...fontStyles.body,
						fontSize: '1rem',
						color: 'var(--color-foreground)',
						margin: '0 0 2rem',
						lineHeight: 1.7,
						fontWeight: 300,
						opacity: 0.7,
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
						color: 'var(--color-secondary)',
					}}
				>
					🌸
				</div>
			</div>
		</div>
	);
}
