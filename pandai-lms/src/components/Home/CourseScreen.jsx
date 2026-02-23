import React from 'react';
import Link from 'next/link';
import ListCard from '../_shared/ListCard';
import Title from '@/components/_shared/Title';

import DummyDataSets from '../../../dummyDatas';

export default function CoursesScreen() {
  return (
    <div className='px-6 pb-24 pt-6'>
      <Title withLogo>Mau belajar apa hari ini?</Title>

      <Title level='h3' mb='mb-4'>
        Direkomendasikan
      </Title>

      <div className='flex flex-col gap-4 mb-8'>
        {DummyDataSets.map(
          (course) =>
            course.isRecommended && (
              <React.Fragment key={course?.id}>
                <ListCard
                  variant='extended'
                  title={course?.title}
                  description={`${course?.progress}/${course?.chapterCount} bab dipelajari`}
                  extendsDescription={course?.recommededDescription}
                  icon={course?.icon}
                />
              </React.Fragment>
            )
        )}
      </div>

      <Title level='h3' mb='mb-4'>
        Semua Mata Pelajaran
      </Title>
      <div className='flex flex-col gap-4'>
        {DummyDataSets?.map((course, cidx) => (
          <Link
            key={cidx}
            href={`/course/${course.title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <ListCard
              title={course.title}
              description={`${course?.progress}/${course?.chapterCount} bab dipelajari`}
              icon={course?.icon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
