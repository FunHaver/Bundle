CREATE TYPE AUTH_METHOD AS ENUM ('LOCAL');
CREATE TYPE SUPPORTED_PLATFORM AS ENUM ('GHOST');
CREATE TYPE DURATION_UNITS AS ENUM ('DAY','WEEK','MONTH','YEAR');


CREATE TABLE application (
  schema_ver INTEGER NOT NULL
);

CREATE TABLE account (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  authentication_method AUTH_METHOD NOT NULL
);

CREATE TABLE publisher (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform SUPPORTED_PLATFORM NOT NULL,
  owner INTEGER REFERENCES account(id) NOT NULL
  uuid VARCHAR(255) NOT NULL
);

CREATE TABLE bundle (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bundle_account_duration_unit DURATION_UNITS NOT NULL,
  bundle_account_duration_amount INTEGER NOT NULL,
  bundle_expiration TIMESTAMP WITH TIME ZONE
);

CREATE TABLE publisher_bundle_association (
  publisher_id INTEGER REFERENCES publisher(id) NOT NULL,
  bundle_id INTEGER REFERENCES bundle(id) NOT NULL,
  PRIMARY KEY (publisher_id, bundle_id)
);

CREATE TABLE subscriber (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  origin INTEGER REFERENCES publisher(id) NOT NULL,
  --list_origin a fk to a table representing a specific subscription from a publisher (multiple bundles for one publisher)
  webhook_unique_id VARCHAR(255) NOT NULL --or binary?
);

CREATE TABLE password (
  account_id INTEGER REFERENCES account(id) NOT NULL,
  hash VARCHAR(60) NOT NULL
);

CREATE TABLE publisher_config (
  publisher_id INTEGER PRIMARY KEY REFERENCES publisher(id),
  api_key VARCHAR(255),
  auto_accept BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE outgoing_subscription (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscription_request_id INTEGER REFERENCES subscriber_request(id) NOT NULL,
  outgoing_publisher_id INTEGER REFERENCES publisher(id) NOT NULL,
  subscription_completed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO application (schema_ver) VALUES (0);
