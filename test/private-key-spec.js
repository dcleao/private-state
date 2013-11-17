define(['private-state.amd'], function(priv) {

    describe("Private", function() {
        it("should be possible to create a key", function() {
            var key = priv.key();

            expect(typeof key).toBe('function');
        });

        it("should be possible to create multiple distinct keys", function() {
            var key1 = priv.key();
            var key2 = priv.key();
            expect(key1).not.toBe(key2);
        });

        describe("Keys", function() {
            it("should have `safe` and `property` methods", function() {
                var key = priv.key();

                expect(typeof key.safe).toBe('function');
                expect(typeof key.property).toBe('function');
            });

            it("should allow creating one or more safes", function() {
                var key = priv.key();
                var safe1 = key.safe();
                var safe2 = key.safe();
                expect(typeof safe1).toBe('function');
                expect(typeof safe2).toBe('function');
                expect(safe1).not.toBe(safe2);
            });

            it("should allow opening safes by them created", function() {
                var key  = priv.key();
                var safe = key.safe();

                expect(function() {
                    key(safe);
                }).not.toThrow();
            });

            it("should not allow opening safes created by other keys, returning undefined", function() {
                var key1  = priv.key();
                var safe1 = key1.safe({});
                var key2  = priv.key();
                expect(key2(safe1)).toBe(undefined);
            });

            it("should throw when called with no arguments or non-functions", function() {
                var key1 = priv.key();

                expect(function() { key1();     }).toThrow();

                expect(function() { key1(null); }).toThrow();

                expect(function() { key1(3);    }).toThrow();
            });

            it("should not pass any information to safes when trying to open them", function() {
                var key1 = priv.key();
                var fakeSafe = function() {
                    expect(arguments.length).toBe(0);
                };

                key1(fakeSafe);
            });

            it("should call the safe function only once when opening it", function() {
                var key1 = priv.key();
                var i = 0;
                var fakeSafe = function() {
                    i++;
                };

                key1(fakeSafe);

                expect(i).toBe(1);
            });

            it("should return undefined when called with a fake safe", function() {
                var key1 = priv.key();
                var fakeSafe = function() {};
                expect(key1(fakeSafe)).toBe(undefined);
            });

            it("should fail to open after an attempt to leak the channel", function() {
                var key1 = priv.key();
                var treasure1 = {};
                var safe1 = key1.safe(treasure1);

                // Place the value in the channel, calling the safe function.
                safe1();

                // Try to read the value in the channel passing a fake, noop safe.
                var noopFakeSafe = function() {};

                expect(function() {
                    key1(noopFakeSafe);
                }).toThrow();
            });
        });

        describe("Safes", function() {

            it("can store a value that can later be retrieved by the key that created them", function() {
                var key = priv.key();

                // Something private.
                var treasure = {};

                // Create a safe that
                // can only be opened with `key` and
                // stores the treasure.
                var safe = key.safe(treasure);

                // Obtain what's contained in the safe
                //  by opening it with the key.
                var result = key(safe);

                expect(result).toBe(treasure);
            });

            it("should each store separate treasures", function() {
                var key = priv.key();

                var treasure1 = {};
                var treasure2 = {};
                var safe1 = key.safe(treasure1);
                var safe2 = key.safe(treasure2);

                expect(key(safe1)).toBe(treasure1);
                expect(key(safe2)).toBe(treasure2);
            });

            it("should return undefined however it is called", function() {
                var key = priv.key();
                var treasure = {};
                var safe = key.safe(treasure);
                expect(safe(    )).toBeUndefined();
                expect(safe(1   )).toBeUndefined();
                expect(safe(true)).toBeUndefined();
            });
        });
    });

});