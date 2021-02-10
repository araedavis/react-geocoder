import React from 'react';
import Downshift from 'downshift';
import { ApiKey } from "@esri/arcgis-rest-auth";
import { geocode } from '@esri/arcgis-rest-geocoding';

import matchSorter from 'match-sorter';
import {
  Label,
  Menu,
  ControllerButton,
  Input,
  Item,
  ArrowIcon,
  XIcon,
  css,
} from './Styles';
import Geocode from './Geocode';

const API_KEY =
  "AAPK60004e6795f54dfb8875d4d9d43eb3f2NQ7ccYJOMHZswyEuQA2_xkxG2kOmYbtCbd1EVAtftXb9TyJfZpzIWQfgEyliK-Do"; // YOUR_API_KEY

export default function Search() {
  const handleStateChange = ({ selectedItem }) => {
    const authentication = new ApiKey({ key: API_KEY});
    if (selectedItem) {
      const { magicKey } = selectedItem;
      geocode({ magicKey, maxLocations: 1, authentication }).then((res) => {
        console.log(res.candidates);
        alert(res.candidates[0].address);
      });
    }
  };
  const getItems = (allItems, filter) => {
    return filter
      ? matchSorter(allItems, filter, {
          keys: ['text'],
        })
      : allItems;
  };

  return (
    <Downshift
      itemToString={(item) => (item ? item.text : '')}
      onStateChange={handleStateChange}
    >
      {({
        selectedItem,
        getInputProps,
        getItemProps,
        highlightedIndex,
        isOpen,
        inputValue,
        getLabelProps,
        clearSelection,
        getToggleButtonProps,
        getMenuProps,
      }) => (
        <div {...css({ width: 450, margin: 'auto' })}>
          <Label {...getLabelProps()}>Search Address</Label>
          <div {...css({ position: 'relative' })}>
            <Input
              {...getInputProps({
                placeholder: 'Search Address',
              })}
            />
            {selectedItem ? (
              <ControllerButton
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <XIcon />
              </ControllerButton>
            ) : (
              <ControllerButton {...getToggleButtonProps()}>
                <ArrowIcon isOpen={isOpen} />
              </ControllerButton>
            )}
          </div>
          <div {...css({ position: 'relative', zIndex: 1000 })}>
            <Menu {...getMenuProps({ isOpen })}>
              {(() => {
                if (!isOpen) {
                  return null;
                }

                if (!inputValue) {
                  return <Item disabled>You have to enter a search query</Item>;
                }

                return (
                  <Geocode address={`${inputValue}`}>
                    {({ loading, error, data = [] }) => {
                      if (loading) {
                        return <Item disabled>Loading...</Item>;
                      }

                      if (error) {
                        return <Item disabled>Error! {error}</Item>;
                      }

                      if (!data.length) {
                        return <Item disabled>No Addresses found</Item>;
                      }

                      return getItems(data, inputValue).map((item, index) => (
                        <Item
                          key={index}
                          {...getItemProps({
                            item,
                            index,
                            isActive: highlightedIndex === index,
                            isSelected: selectedItem === item,
                          })}
                        >
                          {item.text}
                        </Item>
                      ));
                    }}
                  </Geocode>
                );
              })()}
            </Menu>
          </div>
        </div>
      )}
    </Downshift>
  );
}
