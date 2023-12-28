import { Query, SortTypes, Tags } from './course.interface';

export function getDurationInWeeks(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInMilliseconds = end.getTime() - start.getTime();

  const differenceInWeeks =
    differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000);

  return Math.ceil(differenceInWeeks);
}

export function mergeArrays(array1: Tags, array2: Tags): Tags {
  return array2
    .map((obj2) => {
      const matchingObj = array1.find((obj1) => obj1.name === obj2.name);
      return matchingObj ? { ...obj2, ...matchingObj } : obj2;
    })
    .concat(
      array1.filter((obj1) => !array2.some((obj2) => obj2.name === obj1.name))
    );
}

export function queryBuilder(query: Partial<Query>) {
  const pipelines = [];

  let pagination = {
    limit: Number(query.limit) || 4,
    page: Number(query.page) || 1,
    skip: 0,
  };

  let sortOrder: SortTypes = 'asc' as const;
  let sortBy = { _id: sortOrder };

  if (query.page) {
    pagination.skip = (pagination.page - 1) * pagination.limit;
  }

  if (query.sortOrder) {
    sortOrder = query.sortOrder;
  }

  if (query.sortBy) {
    //! TODO: duration should be durationInWeeks
    const entries = query.sortBy
      .split(',')
      .map((val) => [val === 'duration' ? 'durationInWeeks' : val, sortOrder]);
    sortBy = Object.fromEntries(entries);
  }

  if (query.minPrice) {
    pipelines.push({
      $match: {
        price: {
          $gte: Number(query.minPrice) || 0,
        },
      },
    });
  }

  if (query.maxPrice) {
    pipelines.push({
      $match: {
        price: {
          $lte: Number(query.maxPrice),
        },
      },
    });
  }

  if (query.tags) {
    pipelines.push({
      $match: {
        'tags.name': query.tags,
      },
    });
  }

  if (query.startDate) {
    pipelines.push({
      $match: {
        startDate: { $gte: query.startDate },
      },
    });
  }

  if (query.endDate) {
    pipelines.push({
      $match: {
        endDate: { $lte: query.endDate },
      },
    });
  }

  if (query.language) {
    pipelines.push({
      $match: {
        language: query.language,
      },
    });
  }

  if (query.provider) {
    pipelines.push({
      $match: {
        provider: query.provider,
      },
    });
  }

  if (query.durationInWeeks) {
    pipelines.push({
      $match: {
        durationInWeeks: Number(query.durationInWeeks),
      },
    });
  }

  if (query.level) {
    pipelines.push({
      $match: {
        'details.level': query.level,
      },
    });
  }

  // Populating createdBy field
  pipelines.push({
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy',
      let: { createdBy: '$createdBy' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$createdBy'] },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1,
            role: 1,
          },
        },
      ],
    },
  });

  pipelines.push({ $unwind: '$createdBy' });

  return { pipelines, ...pagination, sortBy };
}
