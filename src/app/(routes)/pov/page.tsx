import SectionHeader from '@/components/common/section-header';
import PhotoGrid from '@/components/pov/photo-grid';
import { getPhotos } from '@/lib/server/pov';

export const metadata = {
    title: 'pov',
    description: 'photographs',
};

export default async function PovPage() {
    const photos = await getPhotos();

    return (
        <div className="flex-1 container-wide py-16">
            <div className="md:flex">
                <div className="md:w-1/3 md:pt-56">
                    <SectionHeader
                        title="pov"
                        primaryText="the world"
                        secondaryText="the way i saw it"
                    />
                </div>

                <div className="md:flex-1">
                    <PhotoGrid photos={photos} />
                </div>
            </div>
        </div>
    );
}
