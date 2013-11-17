define(['private-state.amd'], function(priv) {

    describe("Private", function() {
        describe("Keys", function() {
            it("should create private properties by calling the property method", function() {
                var key = priv.key();
                var prop1 = key.property();
                expect(typeof prop1).toBe('function');
            });

            it("should create distinct private properties each time", function() {
                var key = priv.key();
                var prop1 = key.property();
                var prop2 = key.property();

                expect(typeof prop1).toBe('function');
                expect(typeof prop2).toBe('function');
                expect(prop1).not.toBe(prop2);
            });
        });

        describe("Properties", function() {
            it("should have an `init` method and a property `propertyName`", function() {
                var prop = priv.key().property();

                expect(typeof prop.init).toBe('function');
                expect(typeof prop.propertyName).toBe('string');
            });

            it("should have a default random property name", function() {
                var key   = priv.key();
                var prop1 = key.property();
                var prop2 = key.property();

                expect(prop1.propertyName).not.toBe(prop2.propertyName);
            });

            it("should respect a name passed on construction", function() {
                var key  = priv.key();
                var prop = key.property('foo');

                expect(prop.propertyName).toBe('foo');
            });

            it("should initialize an instance with a safe", function() {
                var key  = priv.key();
                var prop = key.property();
                var inst = {};
                var treasure = {};
                prop.init(inst, treasure);

                expect(prop.propertyName in inst).toBe(true);
                var safe = inst[prop.propertyName];

                expect(typeof safe).toBe('function');
            });

            it("should initialize instances with a new safe each time", function() {
                var key  = priv.key();
                var prop = key.property();

                var inst1 = {};
                var treasure1 = {};
                prop.init(inst1, treasure1);

                var inst2 = {};
                var treasure2 = {};
                prop.init(inst2, treasure2);

                var safe1 = inst1[prop.propertyName];
                var safe2 = inst2[prop.propertyName];

                expect(safe1).not.toBe(safe2);
            });

            it("should recover the treasure when given an instance it initialized", function() {
                var key  = priv.key();
                var prop = key.property();

                var inst = {};
                var treasure = {};
                prop.init(inst, treasure);

                var result = prop(inst);

                expect(result).toBe(treasure);
            });

            it("should create safes openable by the original key", function() {
                var key  = priv.key();
                var prop = key.property();

                var inst = {};
                var treasure = {};
                prop.init(inst, treasure);

                var safe = inst[prop.propertyName];

                expect(key(safe)).toBe(treasure);
            });
        });
    });

});