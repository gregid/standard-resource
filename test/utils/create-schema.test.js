import createSchema from '../../src/utils/create-schema';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('createSchema', () => {
  it('does not warn if nothing is passed; returns the default', () => {
    const result = createSchema({});
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('accepts a custom idType', () => {
    function idType() {}
    const result = createSchema({
      idType,
    });

    expect(result).toEqual({
      ...defaultSchema,
      idType,
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('accepts a custom idProperty', () => {
    const result = createSchema({
      idProperty: 'movieId',
    });

    expect(result).toEqual({
      ...defaultSchema,
      idProperty: 'movieId',
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('warns if an invalid idType is defined; uses the default', () => {
    const result = createSchema({
      idType: true,
    });
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_ID_TYPE');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid idProperty is passed; uses the default', () => {
    const result = createSchema({
      idProperty: false,
    });
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_ID_ATTRIBUTE');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid computedAttributes is passed; ignoring it', () => {
    const result = createSchema({
      computedAttributes: false,
    });
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'TYPE_MISMATCH_COMPUTED_ATTRIBUTES'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid computed attribute within computedAttributes is passed; ignoring it', () => {
    function sandwiches() {}

    const result = createSchema({
      computedAttributes: {
        sandwiches,
        other: true,
      },
    });
    expect(result).toEqual({
      ...defaultSchema,
      computedAttributes: {
        sandwiches,
      },
    });
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_COMPUTED_ATTR');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid attributes is passed; ignoring it', () => {
    const result = createSchema({
      attributes: /aa/,
    });
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_ATTRIBUTES');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid attribute within attributes is passed; ignoring it', () => {
    function sandwiches() {}

    const result = createSchema({
      attributes: {
        sandwiches,
        other: true,
      },
    });
    expect(result).toEqual({
      ...defaultSchema,
      attributes: {
        sandwiches,
      },
    });
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_ATTR');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid meta is passed; ignoring it', () => {
    const result = createSchema({
      meta: /aa/,
    });
    expect(result).toEqual(defaultSchema);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_META');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns if an invalid meta value within meta is passed; ignoring it', () => {
    function sandwiches() {}

    const result = createSchema({
      meta: {
        sandwiches,
        other: true,
      },
    });
    expect(result).toEqual({
      ...defaultSchema,
      meta: {
        sandwiches,
      },
    });
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('TYPE_MISMATCH_META_ATTRIBUTE');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });
});
